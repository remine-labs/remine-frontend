<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { api } from "../api/client"

const props = defineProps<{
    embedded?: boolean
}>()

const emit = defineEmits<{
    registered: [work: {
        workId: number
        workTitle: string
        workPosterPath: string
        workReleaseDate?: string
        mediaType: string
        workSource: string
    }]
    cancel: []
}>()

const router = useRouter()

const workTitle = ref("")
const mediaType = ref<"movie" | "tv">("movie")
const memo = ref("")

const addWork = async () => {
    if (!workTitle.value.trim()) return

    try {
        const res = await api.post("/api/custom-works", {
            workTitle: workTitle.value.trim(),
            mediaType: mediaType.value,
            memo: memo.value.trim()
        })

        const data = res.data.data

        if (props.embedded) {
            emit("registered", {
                workId: data.id,
                workTitle: data.workTitle,
                workPosterPath: "",
                workReleaseDate: undefined,
                mediaType: data.mediaType,
                workSource: "CUSTOM"
            })
            return
        }

        router.push({
            path: "/review/create",
            state: {
                workId: data.id,
                workTitle: data.workTitle,
                workPosterPath: "",
                workReleaseDate: undefined,
                mediaType: data.mediaType,
                workSource: "CUSTOM"
            }
        })
    } catch (error) {
        console.error("작품 등록 실패:", error)
    }
}

const handleCancel = () => {
    if (props.embedded) {
        emit("cancel")
        return
    }

    router.back()
}
</script>

<template>
    <section class="custom-work-section">
        <div class="wrap">
            <div class="custom-work-container">
                <div class="input-box media-type-box">
                    <span>종류</span>
                    <div class="radio">
                        <input type="radio" id="radio-movie" name="mediaType" value="movie" v-model="mediaType" />
                        <label for="radio-movie">영화</label>
                    </div>
                    <div class="radio">
                        <input type="radio" id="radio-tv" name="mediaType" value="tv" v-model="mediaType" />
                        <label for="radio-tv">TV 프로그램</label>
                    </div>
                </div>

                <div class="input-box work-title-box">
                    <span>작품명: </span>
                    <div class="input-text">
                        <input type="text" v-model="workTitle" placeholder="작품명을 입력하세요" required />
                    </div>
                </div>

                <textarea v-model="memo" placeholder="등장인물, 줄거리 등 내용을 자유롭게 입력해주세요."></textarea>
            </div>

            <div class="btn-box">
                <button class="neutral-btn" @click="handleCancel">취소</button>
                <button class="active-btn add-work-btn" @click="addWork">
                    등록
                </button>
            </div>

            <div class="notification">
                등록 버튼을 누르면, 리뷰 작성 페이지로 이동합니다.
            </div>
        </div>
    </section>
</template>

<style>
.custom-work-section .custom-work-container .input-box,
.custom-work-section .custom-work-container textarea {
    margin-top: 16px;
}

.custom-work-section .media-type-box {
    display: flex;
    align-items: center;
    gap: 16px;
}

.custom-work-section .media-type-box span {
    margin-right: 15px;
}

.custom-work-section .media-type-box .radio {
    display: flex;
    gap: 6px;
    align-items: center;
}

.custom-work-section .media-type-box .radio label {
    flex-shrink: 0;
}

.custom-work-section .work-title-box {
    display: flex;
    gap: 10px;
    align-items: center;
}

.custom-work-section textarea {
    width: 100%;
    aspect-ratio: 1/ 0.4;
}

.custom-work-section .btn-box {
    display: flex;
    gap: 10px;
    justify-content: right;
    margin: 30px 0 20px;
}

.custom-work-section .notification {
    text-align: right;
    color: var(--text-sub)
}
</style>